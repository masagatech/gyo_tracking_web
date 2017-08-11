import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    // static socketurl: string = "http://localhost:8092/";
    // serviceurl: string = "http://localhost:8092/goyoapi/";
    // uploadurl: string = "http://localhost:8092/images/";
    // filepath: string = "www\\uploads\\";

    static socketurl: string = "http://traveltrack.goyo.in:8080/";
    serviceurl: string = "http://traveltrack.goyo.in:8080/goyoapi/";
    uploadurl: string = "http://traveltrack.goyo.in:8080/images/";
    filepath: string = "www/uploads/";

    public static getWSDetails() {
        let _wsdetails = Cookie.get("_wsdetails_");

        if (_wsdetails !== null) {
            return JSON.parse(_wsdetails);
        }
        else {
            return {};
        }
    }

    public static getEntityDetails() {
        let _enttdetails = Cookie.get("_enttdetails_");

        if (_enttdetails !== null) {
            return JSON.parse(_enttdetails);
        }
        else {
            return {};
        }
    }
}