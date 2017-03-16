import 'beast';

import 'css!./{{block}}.styl';

Beast
.decl('{{block}}', {
    expand: function() {
        this.append('{{block}} is invoked');
    }
})
