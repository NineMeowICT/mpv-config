local mp = require 'mp'
local filter_enabled = false


local function get_max_width()
    local display_width = mp.get_property_native("osd-width")
    local display_height = mp.get_property_native("osd-height")
    print(string.format("osd_width: %s, osd_height: %s", display_width, display_height))
    return math.max(display_width, display_height)
end

local function get_scale()
    local width = mp.get_property_native("width")
    local height = mp.get_property_native("height")
    print(string.format("width: %s, height: %s", width, height))
    local ratio = get_max_width() / math.max(width, height)
    if ratio >= 0.7 and ratio < 2.0 then
        return 2.0
    elseif ratio < 0.7 then
        -- Disable
        return 1
    else
        return ratio
    end
end


function toggle_filter()
    if filter_enabled then
        mp.command("vf remove @rtxsr")
        filter_enabled = false
        mp.osd_message("NVIDIA Scaling: OFF")
    else
        local scale = get_scale()
        local success = mp.command(string.format("vf append @rtxsr:d3d11vpp=scale=%.1f:scaling-mode=nvidia", scale))
        if success then
            filter_enabled = true
            mp.osd_message("NVIDIA Scaling: ON")
        else
            mp.osd_message("Failed to apply NVIDIA Scaling")
        end
    end
end

mp.add_key_binding("ctrl+n", "toggle-nvidia-scaling", toggle_filter)
