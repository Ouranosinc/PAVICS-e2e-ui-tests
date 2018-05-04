// Data
export const ABC_SUFFIX = ' ABC';
export const SEARCH_CRITERIAS_NAME = 'CYPRESS_SEARCH_CRITERIAS_NAME';
export const PROJECT_NAME = 'Cypress project created on ';
export const PROJECT_DESCRIPTION = 'Cypress created this project description';

// Section titles
export const SEARCH_DATASETS_TITLE = 'Search Datasets';
export const PROJECT_MANAGEMENT_TITLE = 'Project Management';
export const DATA_PROCESSING_TITLE = 'Data Processing';
export const PROCESS_MONITORING_TITLE = 'Process Monitoring';
export const ACCOUNT_MANAGEMENT_TITLE = 'Account Management';

// Labels
export const CURRENT_PROJECT_LABEL = 'Current project';
export const CREATE_NEW_PROJECT_LABEL = 'Create new project';
export const SCIENTIFIC_WORKFLOWS_LABEL = 'Scientific Workflows';
export const WPS_PROCESSES_LABEL = 'WPS processes';
export const NO_RESULTS_FOUND_LABEL = "No results found."
export const NO_WORKFLOWS_FOUND_LABEL = "No workflows yet"

// Workflow Inputs
export const WORKFLOW_INPUT_DOWNLOAD_URL = "http://pluvier.crim.ca:8083/thredds/catalog/birdhouse/CMIP5/CCCMA/CanESM2/rcp85/day/atmos/r1i1p1/pr/catalog.xml";
export const WORKFLOW_INPUT_RESOURCE = "https://pluvier.crim.ca/twitcher/ows/proxy/thredds/dodsC/birdhouse/CMIP5/CCCMA/CanESM2/rcp85/day/atmos/r1i1p1/pr/pr_day_CanESM2_rcp85_r1i1p1_20060101-21001231.nc";
export const WORKFLOW_INPUT_TYPENAME = "ADMINBOUNDARIES:canada_admin_boundaries";
export const WORKFLOW_INPUT_FEATUREIDS =  "canada_admin_boundaries.5";
export const WORKFLOW_INPUT_MOSAIC = "True";

// Basic workflow
export const BASIC_WORKFLOW_NAME = "BASIC_WORKFLOW_NAME";
let basicWorkflow = {
	"name": BASIC_WORKFLOW_NAME,
	"tasks": [
		{
			"name": "Downloading",
			"identifier": "thredds_download",
			"inputs": {
				"url": ""
			},
			"progress_range": [
				0,
				40
			],
			"provider": "malleefowl"
		}
	],
	"parallel_groups": [
		{
			"name": "SubsetterGroup",
			"max_processes": 2,
			"map": {
				"task": "Downloading",
				"output": "output",
				"as_reference": false
			},
			"reduce": {
				"task": "Indexing",
				"output": "crawler_result",
				"as_reference": false
			},
			"tasks": [
				{
					"name": "Subsetting",
					"identifier": "subset_WFS",
					"inputs": {
						"typename": "",
						"featureids": "",
						"mosaic": ""
					},
					"linked_inputs": {
						"resource": {
							"task": "SubsetterGroup"
						}
					},
					"progress_range": [
						40,
						80
					],
					"provider": "flyingpigeon"
				},
				{
					"name": "Indexing",
					"identifier": "pavicrawler",
					"linked_inputs": {
						"target_files": {
							"task": "Subsetting",
							"output": "output",
							"as_reference": true
						}
					},
					"progress_range": [
						80,
						100
					],
					"provider": "catalog"
				}
			]
		}
	]
};
let invalidWorkflow = {
	"name": "INVALID_WORKFLOW",
	"tasks": [
		{
			"name": "Downloading",
			"identifier": "thredds_download",
			"inputs": {
				"url": ""
			},
			"progress_range": [
				0,
				40
			],
			"provider": "malleefowl"
		}
	],
	"parallel_groups": []
};

// Escape openning brackets since cypress use them as 'sequences' keywords
export const BASIC_WORKFLOW = JSON.stringify(basicWorkflow).replace(/{/g, '{{}');
export const INVALID_WORKFLOW = JSON.stringify(invalidWorkflow).replace(/{/g, '{{}');