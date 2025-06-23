export interface Connector<T> {
    /*
     * Return the instance of the DB 
     */
    get db(): T;
}