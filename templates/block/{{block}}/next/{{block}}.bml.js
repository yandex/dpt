import 'beast';

import 'css!./{{block}}.less';

Beast
.decl('{{block}}', {
    expand: function() {
        this.append('{{block}} is invoked');
    }
})
