export const DEFAULT_ABOUT = 'Пока ничего не рассказал о себе';
export const DEFAULT_AVATAR = 'https://i.pravatar.cc/300';
export const LAST_WISH_COUNT = 40;
export const TOP_WISH_COUNT = 20;

export const errorText = {
  user: {
    notFound: 'Пользователь не найден',
    emailAlreadyInUse: 'Почта занята', // ToDo Ошибка валидации переданных значений
    usernameAlreadyInUse: 'Имя пользователя занято',
  },
  wish: {
    notFound: 'Желание не найдено',
    notOwnerToUpdate: 'Это чужое желание, вы не можете его изменить',
    notOwnerToRemove: 'Это чужое желание, вы не можете его удалить',
    alreadyRaised: 'Нельзя изменить цену, уже есть желающие скинуться',
    alreadyCopied: 'Вы уже копировали этот подарок',
  },

  offer: {
    notFound: 'Заявки не найден',
    ownWish: 'Нельзя скидываться на собственные подарки',
    exceedPrice: 'Собранная сумма превысит цену подарка',
  },
  wishlist: {
    notFound: 'Список подарков не найден',
    notOwnerToUpdate: 'Это чужой список подарков, вы не можете его изменить',
    notOwnerToRemove: 'Это чужой список подарков, вы не можете его удалить',
  },
  auth: {
    unauthorized: 'Пользователь не авторизован',
  },
};
