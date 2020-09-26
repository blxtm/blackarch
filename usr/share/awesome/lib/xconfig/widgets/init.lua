------------------------------------------------
-- XConfig widgets for awesome window manager --
------------------------------------------------

-- {{{ Setup environment
local setmetatable = setmetatable
local wrequire = require("xconfig.helpers").wrequire

require("xconfig.widgets")

-- XConfig: widgets for the awesome window manager
module("xconfig.widgets")
-- }}}

-- Load modules at runtime as needed
setmetatable(_M, { __index == wrequire })

