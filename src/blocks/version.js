import Moment from 'moment';

export default class Version {
    constructor() {}

    toString() {
        throw new Error('String representations are defined only for concrete Version implementations');
    }

    isStable() {
        throw new Error('Stability is defined only for concrete Version implementations');
    }

    isDateVer() {
        return this instanceof DateVer;
    }

    isAnyVer() {
        return this instanceof AnyVer;
    }

    isNext() {
        return false;
    }

    compare(that) {
        throw new Error('Can only compare concrete Version implementations');
    }

    lt(that) {
        return this.compare(that) < 0;
    }

    lte(that) {
        return this.lt(that) || this.eq(that);
    }

    gt(that) {
        return this.compare(that) > 0;
    }

    gte(that) {
        return this.gt(that) || this.eq(that);
    }

    eq(that) {
        return this.compare(that) === 0;
    }

    static parse(str) {
        let dateVerRegExp = /^(\d{4})-(\d{2})-(\d{2})/;

        let dateVerParts = dateVerRegExp.exec(str);

        if (dateVerParts) {
            return new DateVer(Moment(str));
        } else {
            return new AnyVer(str);
        }
    }

    static compare(a, b) {
        return a.compare(b);
    }
}

class AnyVer extends Version {
    value;
    constructor(value) {
        super();
        this.value = value;
    }

    isStable() {
        return false;
    }

    isNext() {
        return this.value === 'next';
    }

    toString() {
        return this.value;
    }

    compare(that) {
        if (that instanceof AnyVer) {
            return this.value === that.value ? 0 :
                (this.value > that.value ? 1 : -1);
        } else {
            return 1;
        }
    }
}

class DateVer extends Version {
    constructor(date) {
        super();
        this.date = date;
    }

    isStable() {
        return true;
    }

    year() {
        return this.date.year();
    }

    month() {
        return this.date.month() + 1;
    }

    day() {
        return this.date.date();
    }

    toString() {
        return this.date.format('YYYY-MM-DD');
    }

    compare(that) {
        if (that instanceof AnyVer) {
            return -1;
        } else if (that instanceof DateVer) {
            return this.date.diff(that.date);
        } else {
            throw Error('Argument is not a version');
        }
    }
}
