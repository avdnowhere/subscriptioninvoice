class Validate {
    static numberOnly(value) {
        let re = /^\d+$/;
        return re.test(String(value).toLowerCase());
    }
    static email(value) {
        let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(value).toLowerCase());
    }
    static phone(value) {
        let re = /^([0-9]|\+)(\d+){9,15}$/;
        return re.test(String(value));
    }
    static strictPhone(value) {
        let re = /^([1-9]|\+)(\d+){8,15}$/;
        return re.test(String(value));
    }
    static password(value) {
        let re = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).*$/;
        return re.test(String(value));
    }
    static postcode(value) {
        let re = /^[0-9]{5,9}$/;
        return re.test(String(value));
    }
    static website(value) {
        let re = /^(http:\/\/|https:\/\/)?([a-z0-9][a-z0-9-]*\.)+[a-z0-9][a-z0-9-]*$/;
        return re.test(String(value));
    }
}

export default Validate;