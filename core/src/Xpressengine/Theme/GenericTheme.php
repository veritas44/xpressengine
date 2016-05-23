<?php
/**
 *  Class AbstractTheme. This file is part of the Xpressengine package.
 *
 * PHP version 5
 *
 * @category    Theme
 * @package     Xpressengine\Theme
 * @author      XE Team (developers) <developers@xpressengine.com>
 * @copyright   2015 Copyright (C) NAVER <http://www.navercorp.com>
 * @license     http://www.gnu.org/licenses/lgpl-3.0-standalone.html LGPL
 * @link        http://www.xpressengine.com
 */
namespace Xpressengine\Theme;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Xpressengine\Config\ConfigEntity;
use Xpressengine\Storage\File;

/**
 * 이 클래스는 Xpressengine에서 테마를 간편하게 구현할 수 있도록 제공하는 클래스이다. 특정 디렉토리에 지정된 형식에 맞게 테마에 필요한 파일들을 구성한 후,
 * 이 클래스의 $path에 디렉토리의 경로를 지정하여 사용한다.
 *
 * @category    Theme
 * @package     Xpressengine\Theme
 * @author      XE Team (developers) <developers@xpressengine.com>
 * @license     http://www.gnu.org/licenses/lgpl-3.0-standalone.html LGPL
 * @link        http://www.xpressengine.com
 */
abstract class GenericTheme extends AbstractTheme
{
    /**
     * @var string 테마를 정의한 디렉토리 경로, 플러그인디렉토리명을 포함한 디렉토리 경로를 지정해야 한다. ex) 'myplugin/theme'
     */
    protected static $path = null;

    /**
     * @var array
     */
    protected static $info = null;

    /**
     * 테마가 desktop 버전을 지원하는지 조사한다.
     *
     * @return bool desktop 버전을 지원할 경우 true
     */
    public static function supportDesktop()
    {
        return static::info('support.desktop');
    }

    /**
     * 테마가 mobile 버전을 지원하는지 조사한다.
     *
     * @return bool mobile 버전을 지원할 경우 true
     */
    public static function supportMobile()
    {
        return static::info('support.desktop');
    }

    /**
     * get path, example: 'plugins/myplugin/theme'
     *
     * @return mixed
     */
    public static function getPath()
    {
        return trim(str_replace(base_path(), '', plugins_path(static::$path)), DIRECTORY_SEPARATOR);
    }

    /**
     * get theme info
     *
     * @param null $key
     *
     * @return array
     */
    protected static function info($key = null, $default = null)
    {
        if(static::$info === null) {
            static::$info = include(base_path(static::getPath().'/'.'info.php'));
        }

        if ($key !== null) {
            return array_get(static::$info, $key, $default);
        }
        return static::$info;
    }

    /**
     * Get the evaluated contents of the object.
     *
     * @return string
     */
    public function render()
    {
        $config = $this->setting();

        $theme = static::class;

        $view = $this->view($this->info('view', 'theme'));

        return static::$handler->getViewFactory()->make($view, compact('config', 'theme'));
    }

    /**
     * 각 테마는 편집 페이지에서 편집할 수 있는 템플릿파일(blade)이나 css 파일 목록을 지정한다.
     * 이 메소드는 그 파일 목록을 조회한다.
     *
     * @return array
     */
    public function getEditFiles()
    {
        $path = base_path($this->getPath().DIRECTORY_SEPARATOR);
        $editable = $this->info('editable');

        $files = [];
        foreach ($editable as $type => $list) {
            $files[$type] = [];
            foreach ($list as $file) {
                $files[$type][$file] = $path.DIRECTORY_SEPARATOR.$type.DIRECTORY_SEPARATOR.$file;
            }
        }
        return $files;
    }

    /**
     * return content of setting page
     *
     * @param ConfigEntity $config
     *
     * @return \Illuminate\Contracts\View\View|void
     */
    public function getSettingView(ConfigEntity $config = null)
    {
        if ($config === null) {
            $config = $this->setting();
        }
        $view = $this->info('setting', 'setting');
        $theme = static::class;

        if (is_string($view)) {
            return static::$handler->getViewFactory()->make($this->view($view), compact('config', 'theme'));
        } elseif (is_array($view)) {
            return $this->makeConfigView($view, $config);
        }
    }

    /**
     * updateConfig
     *
     * @param array $config
     *
     * @return array
     */
    public function updateSetting(array $config)
    {
        $configId = array_get($config, '_configId');

        // 파일만 별도 처리
        foreach ($config as $key => $item) {
            if($item instanceof UploadedFile) {
                array_set($config, $key, $this->saveFile($configId, $key, $item));
            } elseif($item === null) {
                unset($config[$key]);
            }
        }
        return $config;
    }

    /**
     * setting 과정에서 upload되는 파일을 저장한다.
     *
     * @param              $configId
     * @param              $key
     * @param UploadedFile $file
     *
     * @return array
     */
    protected function saveFile($configId, $key, UploadedFile $file)
    {
        $oldSetting = $this->setting();
        $oldFileId = $oldSetting->get("$key.id");

        // remove old file
        if($oldFileId !== null) {
            $oldFile = File::find($oldFileId);
            if ($oldFile) {
                app('xe.storage')->remove($oldFile);
            }
        }

        // save new file
        $file = app('xe.storage')->upload($file, $configId, null, 'theme');
        $saved = [
            'id'=>$file->id,
            'filename'=>$file->clientname
        ];

        $mediaFile = null;
        if (app('xe.media')->is($file)) {
            $mediaFile = app('xe.media')->make($file);
            $saved['path'] = $mediaFile->url();
        }

        return $saved;
    }

    /**
     * makeConfigView
     *
     * @param array        $info
     * @param ConfigEntity $old
     *
     * @return string
     */
    protected function makeConfigView(array $info, ConfigEntity $old)
    {
        return uio('form', ['class' => $this->getId(), 'inputs' => $info, 'value' => $old]);
    }


    /**
     * get and set config
     *
     * @param ConfigEntity $config
     *
     * @return ConfigEntity
     */
    public function setting(ConfigEntity $config = null)
    {
        if ($config !== null) {
            $this->config = $config;
        }
        return $this->config;
    }

    /**
     * 테마의 asset 파일 주소(url)를 반환한다. 템플릿 파일 작성시 편의를 위해 사용한다.
     *
     * @param string $path   path가 주어질 경우 주어진 파일의 URL을 반환한다. path는 테마의 assets 디렉토리 내에서의 상대 경로이어야 한다.
     * @param string $secure https 여부
     *
     * @return string
     */
    public static function asset($path, $secure = null)
    {
        $path = static::getPath().'/assets/'.$path;
        return asset($path, $secure);
    }

    /**
     * view name을 반환한다. 템플릿 파일 작성시 편의를 위해 사용한다.
     *
     * @param string $view
     *
     * @return string
     */
    public static function view($view)
    {
        $view = str_replace('/','.', static::$path).".views.$view";
        return $view;
    }
}