import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { supabase } from '../lib/supabase';

const MEDIA_BUCKET = 'media';
const THUMB_BUCKET = 'media-thumbs';

const MAX_VIDEO_MS = 2 * 60 * 1000;
const PHOTO_MAX_WIDTH = 1440;
const PHOTO_COMPRESS = 0.72;

const getExt = (uri: string) => {
  const match = uri.split('?')[0].split('.').pop();
  return match ? match.toLowerCase() : 'jpg';
};

const uploadFile = async (bucket: string, path: string, uri: string, contentType: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType,
    upsert: true
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export type UploadResult = {
  mediaId: string;
  url: string;
  thumbnailUrl?: string | null;
  type: 'photo' | 'video';
};

export const pickAndUploadMedia = async (roomId: string, uploaderId: string): Promise<UploadResult | null> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: false,
    quality: 1
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  const isVideo = asset.type === 'video';

  if (isVideo && asset.duration && asset.duration > MAX_VIDEO_MS) {
    throw new Error('Video must be 2 minutes or less.');
  }

  if (!asset.uri) throw new Error('Invalid media URI');

  const timestamp = Date.now();

  if (!isVideo) {
    const manipulated = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: PHOTO_MAX_WIDTH } }],
      { compress: PHOTO_COMPRESS, format: ImageManipulator.SaveFormat.JPEG }
    );

    const filename = `${roomId}/${uploaderId}/${timestamp}.jpg`;
    const url = await uploadFile(MEDIA_BUCKET, filename, manipulated.uri, 'image/jpeg');

    const { data, error } = await supabase
      .from('media')
      .insert({
        room_id: roomId,
        uploader_id: uploaderId,
        type: 'photo',
        url
      })
      .select('id')
      .single();

    if (error) throw error;

    return { mediaId: data.id, url, type: 'photo' };
  }

  const ext = getExt(asset.uri);
  const videoPath = `${roomId}/${uploaderId}/${timestamp}.${ext}`;
  const videoContentType = ext === 'mov' ? 'video/quicktime' : 'video/mp4';
  const videoUrl = await uploadFile(MEDIA_BUCKET, videoPath, asset.uri, videoContentType);

  let thumbUrl: string | null = null;
  try {
    const thumbnail = await VideoThumbnails.getThumbnailAsync(asset.uri, { time: 1500 });
    const thumbPath = `${roomId}/${uploaderId}/${timestamp}-thumb.jpg`;
    thumbUrl = await uploadFile(THUMB_BUCKET, thumbPath, thumbnail.uri, 'image/jpeg');
  } catch {
    thumbUrl = null;
  }

  const { data, error } = await supabase
    .from('media')
    .insert({
      room_id: roomId,
      uploader_id: uploaderId,
      type: 'video',
      url: videoUrl,
      thumbnail_url: thumbUrl
    })
    .select('id')
    .single();

  if (error) throw error;

  return { mediaId: data.id, url: videoUrl, thumbnailUrl: thumbUrl, type: 'video' };
};
