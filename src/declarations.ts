/**
 * ПАРАМЕТРЫ
 */

export interface IAPIErrorParams {
    /**
     * Код ошибки
     */
    code: number;
    /**
     * Тип ошибки
     */
    type: string;
    /**
     * Сообщение ошибки
     */
    message: string;
}

export interface IGeneralApiParams {
    /**
     * Токен мерчанта
     */
    token: string;
}

export interface IEditMerchantParams {
    /**
     * Прямая ссылка на новый аватар мерчанта
     */
    avatar?: string;
    /**
     * Новое имя для мерчанта
     */
    name?: string;
    /**
     * Новая группа для мерчанта
     */
    group_id?: number;
}

/**
 * ОТВЕТЫ
 */
export interface IGetUserResponse {
    /**
     * Прямая ссылка на аватар пользователя
     */
    avatar: string;
    /**
     * Баланс пользователя
     */
    balance: number;
    /**
     * Имя пользователя
     */
    tag: string;
}

export interface IGetMerchantResponse {
    /**
     * Айди мерчанта
     */
    id: number;
    /**
     * Айди владельца мерчанта
     */
    vkId: number;
    /**
     * Баланс мерчанта
     */
    balance: number;
    /**
     * Имя мерчанта
     */
    name: string;
    /**
     * Аватар мерчанта
     */
    avatar: string;
    /**
     * Айди группы куда привязан мерчант
     */
    group_id: number;
    /**
     * Добавлен-ли мерчант в раздел "Игры" сервиса
     */
    is_allow: boolean;
    /**
     * Прямая ссылка на вебхук
     */
    webhook_url: string;
}

export interface IPayment {
    amount: number;
    from_id: number;
    updated_merchant_balance: number;
    updated_user_balance: number;
}