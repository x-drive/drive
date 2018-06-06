const OPT = Object.prototype.toString;
/**
 * 类型判断
 * @param  {Mix}     subject 待判断数据
 * @param  {String}  type    预期的数据类型
 * @return {Boolean}         判断结果
 */
function is(subject, type) {
    type = type.toLowerCase();
    return OPT.call(subject).toLowerCase() === `[object ${type}]`;
}
exports.is = is;

/**
 * 是否是数字
 * @param  {Mix}     val 待判断数据
 * @return {Boolean}     判断结果
 */
function isNumber(val) {
    return is(val, "number");
}
exports.isNumber = isNumber;

/**
 * 是否是函数
 * @param  {Mix} fn     待判断数据
 * @return {Boolean}    判断结果
 */
function isFunction(fn) {
    return is(fn, "function");
}
exports.isFunction = isFunction;

/**
 * 是否是对象
 * @param  {Mix}  obj    待判断数据
 * @return {Boolean}     判断结果
 */
function isObject(obj) {
    return is(obj, "object");
}
exports.isObject = isObject;

/**
 * 是否是 null 值
 * @param  {Mix}     obj 待判断数据
 * @return {Boolean}     判断结果
 */
function isNull(obj) {
    return is(obj, "null");
}
exports.isNull = isNull;
