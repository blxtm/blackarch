-- {{{ Grab environment
local pairs        = pairs
local io           = { lines = io.lines }
local setmetatable = setmetatable
local string       = { match = string.match }
local helpers      = require("xconfig.helpers")
local os = {
	time     = os.time,
	difftime = os.difftime
}
-- }}}

-- Disk I/O: provides I/O statistics for requested storage devices
module("xconfig.widgets.dio")

-- Initialize function table
local disc_usage = {}
local disc_stats = {}
local disc_time  = 0

-- Constant definitions
local unit = { ["s"] = 1, ["kb"] = 2, ["mb"] = 2048 }

-- {{{ Disk I/O widget format
local function worker(format)
	local disc_lines = {}

	for line in io.lines("/proc/diskstats") do
		local device, read, write = 
			-- Linux kernel documentation: Documentation/iostats.txt
			string.match(line, "([^%s]+) %d+ (%d+) %d+ %d+ %d+ (%d+)")
		disc_lines[device] = { read, write }
	end

	local time = os.time()
	local interval = os.difftime(time, disc_time)
	if interval == 0 then interval = 1 end

	for device, stats in pairs(disc_lines) do
		-- Avoid insane values on startup
		local last_stats = disc_stats[device] or stats

		-- Check for overflows and counter resets (> 2^32)
		if stats[1] < last_stats[1] or stats[2] < last_stats[2] then
			last_stats[1], last_stats[2] = stats[1], stats[2]
		end

		-- Diskstats are absolute, subtract our last reading
		-- * divide by timediff because we do not know the timer value
		local read  = (stats[1] - last_stats[1]) / interval
		local write = (stats[2] - last_stats[2]) / interval

		-- Calculate and store I/O
		helpers.uformat(disc_usage, device.." read", read, unit)
		helpers.uformat(disc_usage, device.." write", write, unit)
		helpers.uformat(disc_usage, device.." total", read + write, unit)
	end

	disc_time = time
	disc_stats = disc_lines

	return disc_usage
end
-- }}}

setmetatable(_M, {__call = function(_, ...) return worker(...) end })

