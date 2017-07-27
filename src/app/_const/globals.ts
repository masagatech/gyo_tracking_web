import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    serviceurl: string = "http://localhost:8092/goyoapi/";
    uploadurl: string = "http://localhost:8092/images/";
    filepath: string = "www\\uploads\\";

    // serviceurl: string = "http://traveltrack.goyo.in:8080/goyoapi/";
    // uploadurl: string = "http://traveltrack.goyo.in:8080/images/";
    // filepath: string = "www/uploads/";

    public static getWSDetails() {
        let _wsdetails = Cookie.get("_wsdetails_");

        if (_wsdetails !== null) {
            return JSON.parse(_wsdetails);
        }
        else {
            return {};
        }
    }
}