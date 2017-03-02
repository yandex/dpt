import 'beast';

import 'css!demo-lib.demo-block';

Beast.decl('demo-block', {
    expand: function() {
        this.append('Демо-блок');
    }
});
