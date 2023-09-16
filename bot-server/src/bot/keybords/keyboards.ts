import { KeyboardButtons as kb } from './keyboard-buttons';
import { KeyboardType } from '../../templates/types';

export const Keyboard: KeyboardType = {
  mainPage: [[kb.main.booksSelections, kb.main.profile]],
  profilePage: [[kb.profile.myBooks, kb.profile.myFriends], [kb.profile.back]],
};
