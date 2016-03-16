# NLC Meetup Application
The sample Natural Language Classifier application used for the Cognitive Computing Meetup.

## 1. Create the Classifier
To create a Natural Language Classifier instance, you first need a [Bluemix] account.  Bluemix's free tier is sufficient for this application.  Once you've logged into Bluemix, select "Services & APIs" -> "[Natural Language Classifier]" to create an instance.  During the creation process, name your NLC service `nlc-service-meetup` so that it will match the `manifest.yml` file.  The credential name field can be left as its default value.

## 2. Train the Classifier
The following API calls are used to train a classifier.  The application requires 2 classifiers so this process will need to be completed twice with each of the sample data files (`sample_data/type_sample_data.csv` and `sample_data/importance_sample_data.csv`).  In the following commands, make sure to replace these variables with the appropriate values:
- USERNAME:PASSWORD (can be found in the "Service Credentials" section of your NLC instance on Bluemix)
- TRAINING_DATA_FILE
- CLASSIFIER_NAME (to give the classifier a human readable, not used for anything else)
- NLC_CLASSIFIER_ID

Note: The following commands require that you have [cURL] installed.

#### a. Command to start training the classifier
```sh
curl -u USERNAME:PASSWORD -F training_data=@TRAINING_DATA_FILE -F training_metadata="{\"language\":\"en\",\"name\":\"CLASSIFIER_NAME\"}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
```

#### b. Command to get all classifiers
Use this command to get the classifier's NLC_CLASSIFIER_ID for subsequent commands.
```sh
curl -u USERNAME:PASSWORD "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
```

#### c. Command to check the classifier status
This command is required to know if the classifier is ready or still training.  Training times can take up to 30 minutes but it is highly dependent on the amount of input data.
```sh
curl -u USERNAME:PASSWORD "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/NLC_CLASSIFIER_ID"
```
    
#### d. Classify some text
This command can only be executed after the classifier has finished training.
```sh
curl -u USERNAME:PASSWORD "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers/NLC_CLASSIFIER_ID/classify?text=Mow%20The%20Lawn"
```

## 3. Deploy App to Bluemix
1. Ensure you have [Cloud Foundry CLI] installed
2. Set your target api with `cf api api.ng.bluemix.net`
3. Log in using your Bluemix credentials with `cf login`
4. Modify your `manifest.yml` file such that `TYPE_CLASSIFIER_ID` and `IMPORTANCE_CLASSIFIER_ID` are set to your classifier IDs.
5. Modify your `manifest.yml` file's `name` parameter to something unique.  This will dictate your application's URL (`<name>.mybluemix.net`)
5. Deploy the application using `cf push`


[Cloud Foundry CLI]: <https://docs.cloudfoundry.org/cf-cli/install-go-cli.html>
[Bluemix]: <https://console.ng.bluemix.net>
[Natural Language Classifier]: <https://console.ng.bluemix.net/catalog/services/natural-language-classifier/>
[cURL]: <https://curl.haxx.se/>