/**
 * 自动设置 fontconfig 以加载播放文件路径下 fonts 文件夹内的字体文件
 *
 * 需要 sub-font-provider=fontconfig 和
 * fonts.conf 添加 <include ignore_missing="yes">%CONFIG_DIR%/.fonts.conf</include> 行。
 *
 * compatible_mode (兼容模式) 主要用于解决一些性能问题和 Windows 某些分区上的错误
 */

'use strict';

var FONTCONFIG_XML = '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig>%XML%</fontconfig>';
var FONTCONFIG_DIR_XML = '<dir>%FONTS_DIR%</dir>';

var msg = mp.msg;
var utils = mp.utils;
var commands = require('../script-modules/commands');
var u = require('../script-modules/utils');
var options = {
    enable: true,
    compatible_mode: false,
    compatible_dir: '~~/.fonts',
};
var state = {
    compatible_fonts_dir: utils.join_path(options.compatible_dir, mp.get_script_name() + '-' + mp.get_property_native('pid')),
    fonts_conf: commands.expand_path('~~/.fonts.conf'),
    /** @type {string|null} */
    last_fonts_dir: null,
    os: u.detect_os(),
};
mp.options.read_options(options, 'auto-load-fonts', function () {
    if (!options.compatible_mode) {
        clear_fonts();
        return;
    }
    options.compatible_dir = commands.expand_path(options.compatible_dir);
    state.compatible_fonts_dir = utils.join_path(options.compatible_dir, mp.get_script_name() + '-' + mp.get_property_native('pid'));
});

/**
 * @param {string} command
 * @returns {string[]}
 */
function powershell_command(command) {
    return ['powershell.exe', '-Command', command];
};

/**
 * @param {string} str
 * @returns {string}
 */
function escape_xml(str) {
    return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
}

function clear_fonts() {
    if (!u.dir_exist(state.compatible_fonts_dir)) {
        return;
    }
    var args = [];
    if (state.os === 'windows') {
        args = powershell_command('Remove-Item -Path "%dir%" -Recurse'.replace('%dir%', state.compatible_fonts_dir));
    } else {
        args = ['rm', '-r', state.compatible_fonts_dir];
    }
    commands.subprocess(args);
}

/**
 * @param {string} dir
 * @returns {boolean}
 */
function copy_fonts(path) {
    var args = [];
    var process = null;
    if (!u.dir_exist(options.compatible_dir)) {
        if (state.os === 'windows') {
            args = powershell_command('New-Item -Path "%dir%" -ItemType Directory'.replace('%dir%', options.compatible_dir));
        } else {
            args = ['mkdir', '-p', options.compatible_dir];
        }
        process = commands.subprocess(args);
        if (process.status !== 0) {
            return false;
        }
    }
    if (state.os === 'windows') {
        args = powershell_command('Copy-Item -Path "%src%" -Destination "%dest%" -Recurse'.replace('%src%', path).replace('%dest%', state.compatible_fonts_dir));
    } else {
        args = ['cp', '-p', '-r', path, state.compatible_fonts_dir];
    }
    process = commands.subprocess(args);
    return process.status === 0;
}

/**
 * @param {string} data
 * @param {boolean} require_exist
 */
function write_fonts_conf(data, require_exist) {
    var exist = u.file_exist(state.fonts_conf);
    // 做一些检查，避免无用的重复写入。
    if (require_exist && !exist) {
        return;
    }
    if (exist && utils.read_file(state.fonts_conf) === data) {
        return;
    }
    utils.write_file('file://' + state.fonts_conf, data);
}

(function () {
    if (!options.enable || mp.get_property_native('sub-font-provider') !== 'fontconfig') {
        return;
    }
    if (options.compatible_mode && !state.os) {
        options.compatible_mode = false;
        msg.warn('Unknown OS detected, compatibility mode turned off.');
    }
    mp.add_hook('on_load', 99, function () {
        var path = mp.get_property_native('path');
        var spaths = utils.split_path(path);
        var fonts_dir = u.absolute_path(utils.join_path(spaths[0], 'fonts'));
        if (!u.dir_exist(fonts_dir)) {
            return;
        }
        var info = 'Set fonts dir: ' + fonts_dir;
        if (options.compatible_mode) {
            // 检查是否与上次字体目录相同，避免多次复制文件。
            if (state.last_fonts_dir === fonts_dir) {
                fonts_dir = state.last_fonts_dir;
            } else {
                clear_fonts();
                if (copy_fonts(fonts_dir)) {
                    state.last_fonts_dir = fonts_dir;
                    fonts_dir = state.compatible_fonts_dir;
                    info += ' <- ' + fonts_dir;
                } else {
                    msg.error('copy fonts dir failed: ' + fonts_dir + ' -> ' + state.compatible_fonts_dir);
                }
            }
        }
        var xml = FONTCONFIG_DIR_XML.replace('%FONTS_DIR%', escape_xml(fonts_dir));
        xml = FONTCONFIG_XML.replace('%XML%', xml);
        write_fonts_conf(xml);
        msg.info(info);
    });

    mp.add_hook('on_unload', 99, function () {
        write_fonts_conf(FONTCONFIG_XML.replace('%XML%', ''), true);
    });

    mp.register_event('shutdown', function () {
    if (options.compatible_mode) {
            clear_fonts();
    }
    });
})();
