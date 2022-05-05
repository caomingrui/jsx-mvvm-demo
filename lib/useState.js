/**
 * useState
 * @param initDate 初始化数据
 * @param com 组件名称
 * @returns {(*|update)[]}
 */
export function useState (initDate, com) {
    let data = initDate;
    const update = (d) => {
        if (Object.prototype.toString.call(d) === '[object function]') {
            data = d(data);
            data = Object.assign(com.data, data);
        }
        else {
            data = Object.assign(com.data, d);
        }
    }
    return [data, update];
}
