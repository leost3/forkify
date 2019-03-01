import {elements} from './base';
import { prependOnceListener } from 'cluster';
import { RSA_PKCS1_PSS_PADDING } from 'constants';

export const toggleLikeBtn = isLiked => {
    console.log('liked');
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}

