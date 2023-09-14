import axios from 'axios';

const API_LINK = 'http://api-server:3000';
// const API_LINK = 'http://localhost:3000';

export class UsersService {
  async checkUser(userId: number) {
    try {
      const isUser = await axios.post(`${API_LINK}/users/profile/${userId}`, {
        type: 'profile',
      });
      if (isUser) {
        return true;
      }
    } catch (e) {
      if (
        axios.isAxiosError(e) &&
        e.message === 'Request failed with status code 401'
      ) {
        return false;
      } else {
        console.log('[-]*UsersService*CheckUser*Неизвестная ошибка: ', e);
        throw new Error(`Неизвестная ошибка: ${e}`);
      }
    }
  }
}
