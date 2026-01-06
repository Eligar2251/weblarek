# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

## Базовый код

### Класс Component
Является базовым классом для всех компонентов интерфейса.  
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` — принимает ссылку на DOM элемент, за отображение которого он отвечает.

Поля класса:  
`container: HTMLElement` — поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` — главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах-наследниках будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` — утилитарный метод для модификации DOM-элементов `<img>`.

### Класс Api
Содержит базовую логику отправки HTTP-запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` — в конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` — базовый адрес сервера.  
`options: RequestInit` — объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` — выполняет GET-запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` — принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` — защищенный метод, проверяющий ответ сервера на корректность и возвращающий объект с данными, полученный от сервера, или отклоненный промис в случае некорректных данных.

### Класс EventEmitter
Брокер событий реализует паттерн «Наблюдатель», позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор:  
Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>` — хранит коллекцию подписок на события. Ключи коллекции — названия событий или регулярное выражение, значения — коллекция функций-обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` — подписка на событие, принимает название события и функцию-обработчик.  
`emit<T extends object>(event: string, data?: T): void` — инициализация события. При вызове в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` — возвращает функцию, при вызове которой инициализируется требуемое событие с передачей в него данных из второго параметра.

## Данные

Приложение работает со следующими типами и интерфейсами данных.

### ApiPostMethods
Тип HTTP-методов для отправки данных:
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

IApi
Интерфейс клиента API, используемый в слое коммуникации:
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

TPayment
Способ оплаты:
export type TPayment = 'card' | 'cash';

IProduct
Данные товара:
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

IBuyer
Данные покупателя для оформления заказа:
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

IProductsResponse
Формат ответа сервера при запросе каталога:
export interface IProductsResponse {
  items: IProduct[];
  total: number;
}

IOrderRequest
Формат данных, отправляемых на сервер при оформлении заказа:
export interface IOrderRequest extends IBuyer {
  items: Array<IProduct['id']>;
  total: number;
}

IOrderResponse
Формат ответа сервера при создании заказа:
export interface IOrderResponse {
  id: string;
  total: number;
}

TValidationErrors и TBuyerErrors
Тип ошибок валидации:
`export type TValidationErrors<T> = Partial<Record<keyof T, string>>;`
`export type TBuyerErrors = TValidationErrors<IBuyer>;`

## Модели данных

Модели данных отвечают только за хранение и управление состоянием приложения.
Модели не зависят от отображения (View) и не выполняют запросы к API.

### Класс ProductsCatalog
Назначение: хранение и управление каталогом товаров.

Конструктор:
Конструктор не принимает параметров.

Поля:
`items: IProduct[]` — массив всех товаров в каталоге.
`preview: IProduct | null` — товар, выбранный для подробного просмотра.

Методы:
`setItems(items: IProduct[]): void` — сохраняет массив товаров в модель.
`getItems(): IProduct[]` — возвращает массив товаров из модели.
`getItemById(id: string): IProduct | undefined` — возвращает товар по его id.
`setPreview(product: IProduct | null): void` — сохраняет товар для подробного отображения.
`getPreview(): IProduct | null` — возвращает товар для подробного отображения.

### Класс Basket
Назначение: хранение и управление товарами, выбранными покупателем для покупки.

Конструктор:
Конструктор не принимает параметров.

Поля:
`items: IProduct[]` — массив товаров в корзине.

Методы:
`getItems(): IProduct[]` — возвращает массив товаров, которые находятся в корзине.
`addItem(product: IProduct): void` — добавляет товар в корзину (если он ещё не добавлен).
`removeItem(productId: string): void` — удаляет товар из корзины по id.
`clear(): void` — очищает корзину.
`getTotal(): number` — возвращает стоимость всех товаров в корзине (товары с price: null учитываются как 0).
`getCount(): number` — возвращает количество товаров в корзине.
`hasItem(id: string): boolean` — проверяет наличие товара в корзине по id.

### Класс Buyer

Назначение: хранение и валидация данных покупателя.

Конструктор:
Конструктор не принимает параметров.

Поля:
`data: IBuyer` — текущие данные покупателя
`paymentSelected: boolean` — выбран ли способ оплаты

Методы:
`setData(data: Partial<IBuyer>): void` — сохраняет данные покупателя, при передаче `payment` помечает способ оплаты как выбранный
`getData(): IBuyer` — возвращает текущие данные покупателя
`getPayment(): TPayment | null` — возвращает выбранный способ оплаты или `null`, если пользователь ещё не выбирал оплату
`clear(): void` — очищает данные покупателя и сбрасывает факт выбора оплаты
`validate(): TBuyerErrors` — проверяет валидность полей; `payment` валиден только если `paymentSelected === true`

## Коммуникации

Слой коммуникации отвечает за получение данных с сервера и отправку данных на сервер.
Запросы к API не интегрируются напрямую в модели данных.

### Класс LarekApi
Назначение: выполнение запросов к API сервера для получения каталога и отправки заказа.

Конструктор:
`constructor(api: IApi)` — принимает объект, соответствующий интерфейсу IApi, и использует его методы get и post.

Методы:
`getProducts(): Promise<IProduct[]>` — выполняет GET-запрос к эндпоинту /product/ и возвращает массив товаров.
`createOrder(order: IOrderRequest): Promise<IOrderResponse>` — выполняет POST-запрос к эндпоинту /order/ и передаёт данные заказа, полученные в параметрах метода


## Представление

Слой View отвечает за создание и обновление DOM-элементов интерфейса. Компоненты представления:
- не хранят состояние приложения (данные хранятся в Model),
- не выполняют запросы к API,
- не принимают решений по логике (что показывать/когда показывать решает Presenter),
- генерируют события пользовательских действий через брокер событий IEvents.

## Базовые утилиты DOM
ensureElement и cloneTemplate
Используются всеми компонентами View для поиска элементов и клонирования шаблонов.

`ensureElement<T extends Element>(selector: string, parent?: ParentNode): T` — возвращает найденный элемент или выбрасывает ошибку.
`ensureAllElements<T extends Element>(selector: string, parent: ParentNode): T[]` — возвращает массив элементов по селектору.
`cloneTemplate<T extends HTMLElement>(id: string): T` — клонирует первый дочерний элемент из template#id.

## Базовый класс карточки

### Класс CardView
Назначение: базовый класс для карточек товара. Реализует общий функционал отображения title/price/category/image, общий root-элемент карточки.

Конструктор:
`constructor(root: HTMLElement)` — принимает корневой DOM-элемент карточки (обычно клонированный из <template>).

Поля:
`root: HTMLElement` — корневой элемент карточки.
`titleEl: HTMLElement` — элемент заголовка.
`priceEl: HTMLElement` — элемент цены.
`categoryEl: HTMLElement | null` — элемент категории (если присутствует в шаблоне).
`imageEl: HTMLImageElement | null` — элемент изображения (если присутствует в шаблоне).

Методы:
`render(): HTMLElement` — возвращает root.
`setId(id: string): void` — записывает идентификатор товара в data-id корня.
`setTitle(value: string): void` — устанавливает текст заголовка.
`setPrice(value: number | null): void` — устанавливает цену (форматирование выполняется через formatSynapses).
`setCategory(value: string): void` — устанавливает категорию и модификатор класса на .card__category через categoryMap.
`setImage(src: string, alt?: string): void` — устанавливает картинку.

## Карточки товаров

### Класс CatalogCardView extends CardView
Назначение: карточка товара в каталоге (на главной странице). По клику генерирует событие выбора карточки для просмотра.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий, клонирует шаблон card-catalog, устанавливает обработчик клика.
События:

`ViewEvents.CardSelect` — эмитится при клике на карточку, payload: { id: string }.

### Класс PreviewCardView extends CardView
Назначение: карточка товара для предпросмотра (подробная информация). Содержит описание и кнопку действия (купить/удалить/недоступно).

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий, клонирует шаблон card-preview, настраивает кнопку действия.

Поля:
`textEl: HTMLElement` — блок описания товара.
`actionButton: HTMLButtonElement` — кнопка действия.

Методы:
`setDescription(value: string): void` — устанавливает описание.
`setButton(text: string, disabled: boolean): void` — меняет текст и disabled-состояние кнопки.

События:
`ViewEvents.CardAction` — эмитится при клике по кнопке действия, payload: { id: string }.

### Класс BasketCardView extends CardView
Назначение: строка товара в корзине (элемент списка). Содержит порядковый номер и кнопку удаления.

Конструктор:
`constructor(events: IEvents)` — принимает брокер событий, клонирует шаблон card-basket, настраивает кнопку удаления.

Поля:
`indexEl: HTMLElement` — элемент номера товара в списке.
`deleteButton: HTMLButtonElement` — кнопка удаления.

Методы:
`setIndex(value: number): void` — устанавливает порядковый номер.

События:
`ViewEvents.BasketItemRemove` — эмитится при удалении позиции, payload: { id: string }.

## Компоненты страницы

### Класс HeaderView
Назначение: управление шапкой сайта (кнопка корзины и счётчик).

Конструктор:
`constructor(root: HTMLElement, events: IEvents)`

Поля:
`basketButton: HTMLButtonElement` — кнопка корзины.
`basketCounter: HTMLElement` — счётчик товаров.

Методы:
`render(): HTMLElement`
`setCounter(value: number): void` — обновляет число на счётчике.

События:
`ViewEvents.BasketOpen` — открытие корзины.

### Класс GalleryView
Назначение: контейнер каталога на главной странице.

Конструктор:
`constructor(container: HTMLElement)`

Методы:
`render(): HTMLElement`
`setItems(items: HTMLElement[]): void` — заменяет содержимое каталога набором карточек.

### Класс BasketView
Назначение: отображение корзины: список позиций, сумма, кнопка “Оформить”.

Конструктор:
`constructor(events: IEvents)` — клонирует шаблон basket, настраивает кнопку “Оформить”.

Поля:
`listEl: HTMLUListElement` — список товаров.
`checkoutButton: HTMLButtonElement` — кнопка оформления.
`totalEl: HTMLElement` — элемент суммы.

Методы:
`render(): HTMLElement`
`setItems(items: HTMLElement[]): void` — заменяет содержимое списка.
`setTotal(value: number): void` — устанавливает общую сумму.
`setCheckoutEnabled(enabled: boolean): void` — включает/выключает кнопку оформления.

События:
`ViewEvents.OrderOpen` — открытие формы оформления (шаг 1).

### Класс ModalView
Назначение: управление модальным окном (показ/скрытие и контент). Не имеет наследников.

Конструктор:
`constructor(root: HTMLElement, events: IEvents)` — настраивает закрытие по клику на оверлей и по крестику.

Поля:
`container: HTMLElement` — контейнер модалки.
`closeButton: HTMLButtonElement` — кнопка закрытия.
`content: HTMLElement` — блок для динамического контента.

Методы:
`render(): HTMLElement`
`open(content: HTMLElement): void` — показывает модалку, добавляет класс modal_active.
`close(): void` — скрывает модалку и очищает контент.
`setContent(content: HTMLElement): void` — заменяет контент.

События:
`ViewEvents.ModalClose` — закрытие модального окна.

### Класс SuccessView
Назначение: экран успешной оплаты.

Конструктор:
`constructor(events: IEvents)` — клонирует шаблон success, настраивает кнопку закрытия.

Поля:
`descriptionEl: HTMLElement` — текст с итоговой суммой.
`closeButton: HTMLButtonElement` — кнопка закрытия.

Методы:
`render(): HTMLElement`
`setTotal(total: number): void` — устанавливает текст с суммой.

События:
`ViewEvents.SuccessClose` — закрытие экрана успеха.

## Формы
В приложении используются две формы, объединённые общим базовым классом FormView. Формы не читают данные из моделей напрямую и не валидируют модель — они только эмитят события изменения/отправки.

### Класс FormView
Назначение: базовый класс формы. Подписывается на input и эмитит изменения данных, хранит ссылку на кнопку submit и блок ошибок.

Конструктор:
`constructor(form: HTMLFormElement, events: IEvents)`

Поля:
`form: HTMLFormElement` — корень формы.
`submitButton: HTMLButtonElement` — submit-кнопка.
`errorsEl: HTMLElement` — контейнер ошибок.
`events: IEvents` — брокер событий.

Методы:
`render(): HTMLFormElement`
`setErrors(text: string): void`
`setSubmitEnabled(enabled: boolean): void`
`reset(): void` — сбрасывает поля формы и ошибки.

События:
`ViewEvents.FormChange` — эмитится при вводе в поля формы, payload: { form: string; name: string; value: string }.

### Класс OrderFormView extends FormView
Назначение: форма оформления заказа (шаг 1): выбор оплаты и адрес.

Конструктор:
`constructor(events: IEvents)` — клонирует шаблон order, настраивает клики по кнопкам оплаты и submit.

Поля:
`paymentButtons: HTMLButtonElement[]` — кнопки оплаты.
`addressInput: HTMLInputElement` — поле адреса.

Методы:
`setPayment(method: 'card' | 'cash' | null): void` — подсвечивает выбранный метод через button_alt-active.
`setAddress(value: string): void`

События:
`ViewEvents.OrderPaymentSelect` — выбор оплаты, payload: { method: string }
`ViewEvents.OrderSubmit` — отправка шага 1 (переход к шагу 2)

### Класс ContactsFormView extends FormView
Назначение: форма контактов (шаг 2): email и телефон.

Конструктор:
`constructor(events: IEvents)` — клонирует шаблон contacts, настраивает submit.

Поля:
`emailInput: HTMLInputElement`
`phoneInput: HTMLInputElement`

Методы:
`setEmail(value: string): void`
`setPhone(value: string): void`

События:
`ViewEvents.ContactsSubmit` — отправка шага 2 (оплата и создание заказа)

## События
События объявлены в src/utils/modelEvents.ts:

- ModelEvents.CatalogChanged — изменён каталог товаров.
- ModelEvents.PreviewChanged — изменён выбранный товар для предпросмотра.
- ModelEvents.BasketChanged — изменено содержимое корзины.
- ModelEvents.BuyerChanged — изменены данные покупателя.
- События представления
- События объявлены в src/utils/events.ts:

- ViewEvents.CardSelect — выбор товара в каталоге.
- ViewEvents.CardAction — действие в предпросмотре (купить/удалить).
- ViewEvents.BasketOpen — открытие корзины.
- ViewEvents.BasketItemRemove — удаление товара из корзины.
- ViewEvents.OrderOpen — открытие оформления (шаг 1).
- ViewEvents.OrderPaymentSelect — выбор способа оплаты.
- ViewEvents.FormChange — изменение полей форм.
- ViewEvents.OrderSubmit — подтверждение шага 1.
- ViewEvents.ContactsSubmit — подтверждение шага 2 (оплата).
- ViewEvents.SuccessClose — закрытие экрана успеха.
- ViewEvents.ModalClose — закрытие модального окна.

## Презентер
Презентер реализован в src/main.ts и содержит обработчики событий от Model и View. Он:

- получает данные из API (через LarekApi) и сохраняет их в модели;
- обрабатывает события моделей и обновляет View;
- обрабатывает события View и вызывает методы моделей;
- формирует объект IOrderRequest и отправляет заказ на сервер;
- после успешной оплаты очищает модели корзины и покупателя.

Важно: презентер не хранит данные предметной области (товары, корзину, покупателя) — все данные хранятся в моделях. Рендер представлений выполняется:
- при событиях изменения моделей;
- при событиях открытия модального окна.