module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Beast": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 7,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": 0,
        "no-undef": 0, // let Flow handle that
        "no-unused-vars": 0, // conflicts with Flow
        "quotes": [
            "error",
            "single"
        ],
        "react/jsx-uses-vars": 1,
        "semi": [
            "error",
            "always"
        ],
        "space-before-blocks": 2,
        "space-before-function-paren": [2, "never"]
    }
};