import Sound from 'react-native-sound';

import MusicResources from '../common/music';

export default class SoundUtil {
    static sounds = [];
    static index = 0;

    static init = () => {
        for (let i = 1; i <= 7; i++) {
            let sound = new Sound(MusicResources['background' + i]);
            SoundUtil.sounds.push(sound);
        }
    }

    static random = () => {
        let len = SoundUtil.sounds.length;
        for (let i = 0; i < len - 1; i++) {
            let index = parseInt(Math.random() * (len - i));
            let temp = SoundUtil.sounds[index];
            SoundUtil.sounds[index] = SoundUtil.sounds[len - i - 1];
            SoundUtil.sounds[len - i - 1] = temp;
        }
    }

    static play = () => {
        let sound = SoundUtil.sounds[SoundUtil.index];
        if (sound) {
            sound.play((bool) => {
                if (bool) {
                    SoundUtil.index++;
                    if (!SoundUtil.sounds[SoundUtil.index]) SoundUtil.index = 0;
                    SoundUtil.play();
                }
            });
        }
    }

    static pause = () => {
        let sound = SoundUtil.sounds[SoundUtil.index];
        if (sound) {
            sound.pause();
        }
    }

    static stop = () => {
        let sound = SoundUtil.sounds[SoundUtil.index];
        if (sound) {
            sound.stop();
            SoundUtil.index++;
            if (!SoundUtil.sounds[SoundUtil.index]) SoundUtil.index = 0;
        }
    }

    static release = () => {
        for (let i in SoundUtil.sounds) {
            SoundUtil.sounds[i].release();
            delete SoundUtil.sounds[i];
        }
    }
}