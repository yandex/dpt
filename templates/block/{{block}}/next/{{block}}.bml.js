import 'beast';

import 'css!{{lib}}.{{block}}';

Beast
.decl('{{block}}', {
    expand: function() {
        this.append('{{block}} is invoked');
    }
});
