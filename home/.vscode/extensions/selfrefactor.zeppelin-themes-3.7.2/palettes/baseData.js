export const COLOR_0 = [
  'constant.character',
  'constant.language.boolean',
  'entity.name.tag.UNDERLINE',
  'keyword',
  'markup.italic',
  'punctuation.accessor.js',
  'punctuation.separator.key-value.js',
  'storage.modifier.js',
  'storage.type',
  'string.template',
  'support.constant',
  'support.function.dom.js',
  'support.variable.property.js',
  'variable.language.constructor.UNDERLINE',
  'variable.language.this',
]

export const COLOR_1 = [
  'comment.block.documentation',
  'comment.line.double-slash',
  'constant.language.null.js',
  'entity.name.type',
  'entity.other.inherited-class',
  'markup.heading.markdown',
  'meta.brace.round.js',
  'entity.name.function.UNDERLINE',
  'meta.tag.attributes.js',
  'punctuation.accessor.js',
  'punctuation.separator.comma.js',
  'source.js',
  'storage.modifier.async.js',
  'support.class.builtin.js',
  'support.type.primitive.js',
  'support.variable.property.js',
  'variable',
  'variable.other.object.js',
  'variable.other.readwrite',
  'variable.other.readwrite.js',
]

export const COLOR_2 = [
  'comment',
  'constant.language',
  'constant.other',
  'keyword.control.flow.js',
  'keyword.control.module.js',
  'keyword.operator.accessor',
  'markup.italic',
  'meta.import.js',
  'meta.object-literal.key.js',
  'meta.paragraph.markdown',
  'punctuation.definition.block.js',
  'punctuation.separator.parameter.js',
  'string.quoted.single.js',
  'string.quoted.single.json',
  'support.class.promise.js',
  'support.function',
  'support.function.console.js',
  'support.type.object.console.js',
  'variable.parameter',
]

export const COLOR_3 = [
  'meta.tag.js',
  'variable.language',
  'invalid.UNDERLINE',
  'constant.numeric',
  'meta.brace.square.js',
  'meta.var.expr.js',
  'keyword.control.import.js',
  'keyword.control.from.js',
  'keyword.control.export.js',
  'keyword.control.default.js',
  'support.type.object.module.js',
  'punctuation.definition.parameters.begin.js',
  'punctuation.definition.parameters.end.js',
  'markup.quote',
  'entity.other.attribute-name.js',
  'meta.parameters.js',
  'variable.other.class.js',
  'constant.other.object.key.js',
  'entity.name.function.method',
  'string.quoted.single.js',
  'support.type.property-name.json',
  'variable.other.property.js',
  'entity.name.class.UNDERLINE',
]

export const baseBase = {
  name   : '_Palette',
  type   : 'light',
  colors : {
    'diffEditor.removedTextBackground'  : '#64B5F655',
    'diffEditor.insertedTextBackground' : '#9c824a55',
    'editor.background'                 : 'COLOR_BACK',
    'activityBar.background'            : 'COLOR_SECONDARY',
    'editor.selectionBackground'        : 'COLOR_SELECTION',
    'editorBracketMatch.background'     : 'COLOR_2_DARKER',
    'editorBracketMatch.border'         : 'COLOR_3_DARKER',
    'editorGroupHeader.tabsBackground'  : 'COLOR_BACK_DARK',
    'editorGutter.background'           : 'COLOR_BACK',
    'editorLineNumber.foreground'       : 'COLOR_SECONDARY_DARKER',
    'scrollbarSlider.background'        : 'COLOR_SECONDARY',
    'scrollbarSlider.hoverBackground'   : 'COLOR_SECONDARY_DARKER',
    'sideBar.background'                : 'COLOR_SECONDARY_DARK',
    'statusBar.background'              : 'COLOR_SECONDARY_DARKEST',
    'editor.lineHighlightBackground'    : 'COLOR_BACK_DARK',
    'tab.inactiveForeground'            : 'COLOR_BACK_DARK',
    'tab.inactiveBackground'            : 'COLOR_SECONDARY_DARKEST',
    'tab.activeForeground'              : 'COLOR_SECONDARY_DARKEST',
    'tab.activeBackground'              : 'COLOR_BACK_DARK',
    'tab.border'                        : 'COLOR_BACK',
  },
}

export const baseData = {
  COLOR_0,
  COLOR_1,
  COLOR_2,
  COLOR_3,
}

export const all = [
  ...COLOR_0,
  ...COLOR_1,
  ...COLOR_2,
  ...COLOR_3,
]
