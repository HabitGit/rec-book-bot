export enum MessageTypeEnum {
  welcome = 'welcome',
  welcomeBack = 'welcomeBack',
  profileData = 'profileData',
  noBooks = 'noBooks',
}

type MessageOptions = {
  type: MessageTypeEnum;
  userName?: string;
  genres?: string[];
  inviteLink?: string;
};

export function MessageGenerator(messageOptions: MessageOptions) {
  switch (messageOptions.type) {
    case MessageTypeEnum.welcomeBack:
      return `С возвращением ${messageOptions.userName}`;
    case MessageTypeEnum.welcome:
      return `Добро пожаловать ${messageOptions.userName}!`;
    case MessageTypeEnum.profileData:
      return (
        `***Мой профиль***` +
        `\n` +
        `Имя: ${messageOptions.userName}.` +
        `\n` +
        `Любимый жанр:\n${messageOptions.genres}` +
        '\n' +
        `Ваша инвайт [ссылка](${messageOptions.inviteLink})`
      );
    case MessageTypeEnum.noBooks:
      return 'Вы еще не отметили ни одной книги';
  }
}
