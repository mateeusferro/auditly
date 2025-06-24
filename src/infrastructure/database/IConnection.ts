export interface IConnection<T> {
    /*
     * Return the instance of the DB 
     */
    get pool(): T;
}