import JSZip from 'jszip/dist/jszip';
import saveAs from 'file-saver/dist/FileSaver';

const dataControllerPhp = `<?php
/**
 * {{componentName}} Joomla Component
 *
 * @copyright  Copyright (C) 2016 Michael Babker. All rights reserved.
 * @license    GNU/GPL - http://www.gnu.org/copyleft/gpl.html
 */
defined('_JEXEC') or die;

use Joomla\\CMS\\Factory;
use Joomla\\CMS\\Language\\Text;
use Joomla\\CMS\\MVC\\Controller\\BaseController;

/**
 * {{componentName}} Component Base Controller
 *
 * @since  1.0
 */
class {{componentName}}Controller extends BaseController {
  /**
   * Method to display a view.
   *
   * @param   boolean  $cachable   If true, the view output will be cached
   * @param   array    $urlparams  An array of safe url parameters and their variable types, for valid values see JFilterInput::clean().
   *
   * @return  $this
   *
   * @see     JFilterInput::clean()
   * @since   1.0
   */
  public function display($cachable = false, $urlparams = array()) {
    $cachable = Factory::getUser()->guest;

    /*
     * If the user's requesting a non-existing page and is using this as their default menu item, they'll get a "view not found" error.
     * If that's the error they received, convert it to a more generic and human friendly "content not found" message.
     */
    try {
      return parent::display($cachable, $urlparams);
    } catch (Exception $e) {
      $trace = $e->getTrace();

      $thrower = $trace[0];

      // If this is the "view not found" error, the thrower is JControllerLegacy::getView(); standardize to lowercased strings just in case
      if (strtolower($thrower['class']) === 'basecontroller' && strtolower($thrower['function']) === 'getview') {
        throw new Exception(Text::_('JERROR_LAYOUT_REQUESTED_RESOURCE_WAS_NOT_FOUND'), 404, $e);
      }

      // Some other error, just let it bubble up
      throw $e;
    }
  }
}
`; const dataEmptyPhp = `<?php
/**
 * {{componentName}} Joomla Component
 *
 * @copyright  Copyright (C) 2016 Michael Babker. All rights reserved.
 * @license    GNU/GPL - http://www.gnu.org/copyleft/gpl.html
 */
use Joomla\\CMS\\Factory;
use Joomla\\CMS\\MVC\\Controller\\BaseController;

defined('_JEXEC') or die;

$controller = BaseController::getInstance('{{componentName}}');
$controller->execute(Factory::getApplication()->input->get('task', '', 'cmd'));
$controller->redirect();
`; const dataEmptyXml = `<?xml version="1.0" encoding="utf-8"?>
<extension type="component" version="3.9" client="site" method="upgrade" element="com_empty">
  <name>{{componentName}} Component</name>
  <element>com_{{componentNameLowercase}}</element>
  <author>Michael Babker</author>
  <creationDate>11 June 2016</creationDate>
  <copyright>(C) 2016 Michael Babker, All Rights Reserved.</copyright>
  <license>http://www.gnu.org/copyleft/gpl.html GNU/GPL</license>
  <authorEmail>michael.babker@gmail.com</authorEmail>
  <authorUrl>https://www.babdev.com</authorUrl>
  <version>1.0.0</version>
  <description>An empty component designed for pages which are showing modules only, save resources by not dispatching a component!</description>
  <files folder="site">
    <filename component="com_{{componentNameLowercase}}">{{componentNameLowercase}}.php</filename>
    <filename>controller.php</filename>
    <folder>views</folder>
  </files>
  <administration>
    <!-- This is seriously required for a component to install... Sad panda... -->
  </administration>
</extension>
`; const dataViewHtmlPhp = `<?php
/**
 * {{componentName}} Joomla Component
 *
 * @copyright  Copyright (C) 2016 Michael Babker. All rights reserved.
 * @license    GNU/GPL - http://www.gnu.org/copyleft/gpl.html
 */

defined('_JEXEC') or die;

use Joomla\\CMS\\MVC\\View\\HtmlView as BaseHtmlView;

/**
 * Default HTML view class
 *
 * @since  1.0
 */
class {{componentName}}ViewDefault extends BaseHtmlView {
  /**
   * Display the view
   *
   * @param   string  $tpl  The name of the template file to parse
   *
   * @return  mixed  A string if successful, otherwise a JError object.
   *
   * @since   1.0
   */
  public function display($tpl = null) {
    $app = JFactory::getApplication();

    $params = $app->getParams();

    $title = $params->get('page_title', '');

    if (empty($title)) {
      $title = $app->get('sitename');
    } elseif ($app->get('sitename_pagetitles', 0) == 1) {
      $title = JText::sprintf('JPAGETITLE', $app->get('sitename'), $title);
    } elseif ($app->get('sitename_pagetitles', 0) == 2) {
      $title = JText::sprintf('JPAGETITLE', $title, $app->get('sitename'));
    }

    $this->document->setTitle($title);

    if ($params->get('menu-meta_description')) {
      $this->document->setDescription($params->get('menu-meta_description'));
    }

    if ($params->get('menu-meta_keywords')) {
      $this->document->setMetaData('keywords', $params->get('menu-meta_keywords'));
    }

    if ($params->get('robots')) {
      $this->document->setMetaData('robots', $params->get('robots'));
    }

    return parent::display($tpl);
  }
}
`; const dataMetadataXml = `<?xml version="1.0" encoding="utf-8"?>
<metadata>
  <view title="{{componentName}} Component">
    <message><![CDATA[{{componentName}} Component]]></message>
  </view>
</metadata>`; const dataDefaultPhp = `<?php
/**
 * {{componentName}} Joomla Component
 *
 * @copyright  Copyright (C) 2016 Michael Babker. All rights reserved.
 * @license    GNU/GPL - http://www.gnu.org/copyleft/gpl.html
 */
defined('_JEXEC') or die;

use Joomla\\CMS\\HTML\\HTMLHelper;
use Joomla\\CMS\\Uri\\Uri;
use Joomla\\CMS\\Factory;

$document = Factory::getDocument();
$renderer = $document->loadRenderer('modules');

// Alternative method
//$document->setTitle('Creating perfect grid layouts');
//$document->setDescription('The best grid creation tool');

// The actual page:
echo
$renderer->render('some-module-position', array('style' => 'raw'), null),
$renderer->render('some-other-module-position', array('style' => 'raw'), null);
`; const dataDefaultXml = `<?xml version="1.0" encoding="utf-8"?>
<metadata>
  <layout title="{{componentName}} Component" option="default">
    <message>
      <![CDATA[Render an {{componentNameLowercase}} component page]]>
    </message>
  </layout>
</metadata>
`;
export { JSZip, saveAs, dataControllerPhp, dataEmptyPhp, dataEmptyXml, dataViewHtmlPhp, dataMetadataXml, dataDefaultXml, dataDefaultPhp };
