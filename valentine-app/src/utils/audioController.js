/**
 * Centralised audio controller.
 * Dispatches custom events so any audio player can tell others to pause.
 *
 * Usage:
 *   import { requestPlay, onAudioRequest } from '../utils/audioController';
 *
 *   // Before playing your audio, call:
 *   requestPlay(myId);  // e.g. 'bgMusic' | 'voiceNote'
 *
 *   // Each player listens and pauses itself when another player requests to play:
 *   useEffect(() => {
 *     return onAudioRequest((id) => {
 *       if (id !== myId) pauseMyAudio();
 *     });
 *   }, []);
 */

const EVENT_NAME = 'everwish:audio-request';

/** Call this immediately before you call audio.play() */
export function requestPlay(sourceId) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { sourceId } }));
}

/**
 * Subscribe to audio-request events.
 * @param {(sourceId: string) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onAudioRequest(callback) {
  const handler = (e) => callback(e.detail.sourceId);
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
