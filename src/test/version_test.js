import assert from 'assert';
import Version from '../blocks/version';

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

describe('Version', function() {
    it('parses SemVer', function() {
        assert(Version.parse('1.0.0').isSemVer());
        assert(Version.parse('1.0.0test3').isSemVer());
        assert(Version.parse('0.9123.0a').isSemVer());
        assert(!Version.parse('notsemver').isSemVer());
        assert(!Version.parse('a1.9.0s').isSemVer());

        let version1 = Version.parse('1.0.0design');
        assert(version1.isSemVer());
        assert.equal(1, version1.major);
        assert.equal(0, version1.minor);
        assert.equal(0, version1.patch);
        assert.equal('design', version1.variant);
    });

    it('parses DateVer', function() {
        let version1 = Version.parse('2015-08-12');

        assert(version1.isDateVer());
        assert(Version.parse('2102-12-31').isDateVer());
        assert(!Version.parse('notdatever').isDateVer());
        assert(!Version.parse('1.0.31').isDateVer());
        assert(!Version.parse('a2001-12-31b').isDateVer());

        assert.equal(2015, version1.year());
        assert.equal(8, version1.month());
        assert.equal(12, version1.day());
    });

    it('parses AnyVer', function() {
        assert(Version.parse('any').isAnyVer());
        assert(Version.parse('a1.0.0').isAnyVer());
    });

    it('sorts versions', function() {
        let versions = ['0.0.0', '1.0.0', '1.0.0a', '2015-03-12', '2015-08-12',
            'any', 'design'].map(Version.parse);
        let expected = versions.slice(0);

        for (let i = 0; i < 50; i++) {
            shuffle(versions);
            assert.deepEqual(expected, versions.sort(Version.compare));
        }

        let semVer1 = Version.parse('1.0.0');
        let semVer2 = Version.parse('1.0.0a');
        let dateVer1 = Version.parse('2015-03-01');
        let dateVer2 = Version.parse('2015-05-21');
        let anyVer = Version.parse('any');

        assert(semVer1.eq(semVer1));
        assert(semVer1.lt(semVer2));
        assert(semVer1.lt(dateVer1));
        assert(dateVer1.lt(dateVer2));
        assert(dateVer2.gt(dateVer1));
    });
});
