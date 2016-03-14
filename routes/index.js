var express = require('express');
var router = express.Router();
var extend = require('util')._extend;

/**
 * Create and configure the NLC object
 */
var watson = require('watson-developer-cloud');

// Setup defaults creds
var credentials = {
  version: 'v1',
  url: '<NLC_SERVICE_URL>',
  username: '<NLC_USERNAME>',
  password: '<NLC_PASSWORD>'
};

// Pull credentials from VCAP variable  
if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  if (services['natural_language_classifier'] && services['natural_language_classifier'].length) {
    var service = services['natural_language_classifier'][0];
  
    credentials = {
      version: 'v1',
      url: service.credentials.url,
      username: service.credentials.username,
      password: service.credentials.password
    };
  } else {
    console.warn("VCAP_SERVICES doesn't contain a NLC entry, using default");
  }
} else {
  console.warn("VCAP_SERVICES doesn't exist, using default");
}

var natural_language_classifier = watson.natural_language_classifier(credentials);


/**
 * Setup classifier id values
 */
var typeClassifierId = '<TYPE_CLASSIFIER_ID>';
var importanceClassifierId = '<IMPORTANCE_CLASSIFIER_ID>';

if (process.env.TYPE_CLASSIFIER_ID) {
  typeClassifierId = process.env.TYPE_CLASSIFIER_ID;
} else {
  console.warn("TYPE_CLASSIFIER_ID is not defined as an environment variable, using default");
}

if (process.env.IMPORTANCE_CLASSIFIER_ID) {
  importanceClassifierId = process.env.IMPORTANCE_CLASSIFIER_ID;
} else {
  console.warn("IMPORTANCE_CLASSIFIER_ID is not defined as an environment variable, using default");
}


/**
 * Class labels and ordering for the type classifier
 */
const TYPE_CLASS_LABELS = [
  {
    className: "personal",
    label: "Personal"
  },
  {
    className: "work",
    label: "Work-Related"
  }
];

/**
 * Class labels and ordering for the importance classifier
 */
const IMPORTANCE_CLASS_LABELS = [
  {
    className: "low",
    label: "Low Importance"
  },
  {
    className: "med",
    label: "Med Importance"
  },
  {
    className: "high",
    label: "High Importance"
  }
];

/**
 * GET initial form page
 */
router.get('/', function(req, res, next) {
  res.render('index');
});

/**
 * POST form data to get classifier results
 */
router.post('/', function(req, res, next) {
  var typeClassifierResults = null;
  var importanceClassifierResults = null;
    
  // Call the Person / Work classifier
  natural_language_classifier.classify({
    text: req.body.classifyText,
    classifier_id: typeClassifierId },
    function(err, response) {
      if (err) {
        console.log('error:', err);
        res.render('index', { title: "Fail" });
      } else {
        typeClassifierResults = response;
        complete();
      }
  });

  // Call the Importance classifier
  natural_language_classifier.classify({
    text: req.body.classifyText,
    classifier_id: importanceClassifierId },
    function(err, response) {
      if (err) {
        console.log('error:', err);
        res.render('index', { title: "Fail" });
      } else {
        importanceClassifierResults = response;
        complete();
      }
  });

  /**
   * Function to verify that both classifiers have returned successfully
   */
  function complete() {
    if (typeClassifierResults !== null && importanceClassifierResults !== null) {
      res.render('index', { 
        typeClassifierResults: formatClassifierResults(TYPE_CLASS_LABELS, typeClassifierResults),
        importanceClassifierResults: formatClassifierResults(IMPORTANCE_CLASS_LABELS, importanceClassifierResults),
        previousClassifyText: req.body.classifyText
      });
    }
  }

  /**
   * Formats the classifier results in a consistent way for the UI
   */
  function formatClassifierResults(classLabels, classifierResults) {
    results = [];

    for(var i = 0; i < classLabels.length; i++) { 
        var entry = {
          "label": classLabels[i].label,
          "confidence": getConfidenceByClassName(classLabels[i].className, classifierResults)
        };

        results.push(entry);
    }

    return results;
  }

  /**
   * Gets the confidence for a particular className
   */
  function getConfidenceByClassName(className, classifierResults) {
    for(var i = 0; i < classifierResults.classes.length; i++) {
        if (className === classifierResults.classes[i].class_name) {
          return classifierResults.classes[i].confidence;
        }
    }

    return "";
  }
});

module.exports = router;
