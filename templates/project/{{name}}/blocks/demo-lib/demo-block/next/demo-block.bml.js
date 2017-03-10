import 'beast';

import 'css!./demo-block.less';

Beast.decl('demo-block', {
    expand: function() {
        this.append('Демо-блок');
    }
});
