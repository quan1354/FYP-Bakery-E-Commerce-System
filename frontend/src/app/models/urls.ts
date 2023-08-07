const BASE_URL = 'http://localhost:5000'


//** Product Url **
export const PRODUCT_URL = BASE_URL + '/api/products';
export const PRODUCT_BY_SEARCH_URL = PRODUCT_URL + '/search/';
export const PRODUCT_BY_TAG_CATEGORY = PRODUCT_URL + '/category/';
export const PRODUCT_BY_ID_URL = PRODUCT_URL + '/productid/';
export const PRODUCT_DELETE_BY_ID = PRODUCT_URL + '/delete/'
export const PRODUCT_CREATE_URL = PRODUCT_URL + '/create';
export const PRODUCT_UPDATE_URL = PRODUCT_URL + '/update';
export const PRODUCT_UPDATE_RATING = PRODUCT_URL + '/rating';
export const PRODUCT_TAGS_CATEGORY = PRODUCT_URL + '/category';

//** User Url **
export const USER_URL = BASE_URL + '/api/users';
export const USER_LOGIN_URL = USER_URL + '/login';
export const USER_REGISTER_URL = USER_URL + '/register';
export const USER_RESET_PASSWORD = USER_URL + '/resetPassword';
export const USER_GET_BY_ID =  USER_URL + '/userDetail/';
export const USER_UPDATE_URL = USER_URL + '/update';
export const USER_DELETE = USER_URL + '/delete/';
export const USER_UPDATE_PREFERENCE = USER_URL + '/preference';

//** Order Url **
export const ORDER_URL = BASE_URL + '/api/orders'
export const ORDER_CREATE_URL = ORDER_URL + '/create'
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDER_URL + '/newOrderForCurrentUser'
export const ORDER_PAY_URL = ORDER_URL + '/pay'
export const ORDER_GET_MYORDERS = ORDER_URL + '/myOrder'
export const ORDER_DELETE_BY_URL = ORDER_URL + '/delete/'
export const ORDER_EDIT_BY_URL = ORDER_URL + '/update'
export const ORDER_PASS_IMAGE = ORDER_URL + '/image' 




