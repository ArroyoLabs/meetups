<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8"> 
  <meta charset="utf-8">

<?php
	// Render meta tags
	foreach($data->getMeta() as $name => $content)
		echo '<meta name="'.$name.'" content="'.$content.'" >';

  // Determine page title
  $title = $data->getTitle();
  if( $data->getPageTitle() )
    $title = $data->getPageTitle()." - ".$title;
?>
<title><?php echo $title ?></title>

<?php
  // Moved Js to the header for D3
  foreach($this->getJs() as $js)
  {
    if($js['active'])
      echo "<script src='".$js['file']."'></script>\n";
  }
?>

<?php
  // Spit out CSS
  foreach($data->getCss() as $css)
    echo "<link rel='stylesheet' href='".$css['file']."' type='text/css' />\n";
?>
</head>
<body>

<div id="pagewrap">
  <?php echo $data->getHeader(); ?>
  <div class="content-main">
    <?php echo $this->getLayout(); ?>
  </div>
  <?php echo $data->getFooter(); ?>
</div>

<script type="text/javascript">/* <![CDATA[ */
$(document).ready(function() {

});
/* ]]> */</script>

</body>
</html>
