module.exports = {
    extends: 'stylelint-config-sass-guidelines',
    rules: {
        indentation: 4,
        'max-nesting-depth': 4,
        'order/properties-alphabetical-order': null,
        'scss/at-extend-no-missing-placeholder': null,
        'at-rule-disallowed-list': 'always',
        'declaration-property-value-disallowed-list': null,
        'no-duplicate-at-import-rules': true,
        'no-duplicate-selectors': true,
        'selector-class-pattern': null,
        'selector-max-compound-selectors': null,
        'selector-max-id': null,
        'order/order': null,
        'selector-no-qualifying-type': [
            true, {
                ignore: ['attribute', 'class']
            }
        ]
    }
};
