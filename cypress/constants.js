// Data
export const ABC_SUFFIX = ' ABC';
export const SEARCH_CRITERIAS_NAME = 'CYPRESS_SEARCH_CRITERIAS_NAME';
export const PROJECT_NAME = 'Cypress project created on ';
export const PROJECT_DESCRIPTION = 'Cypress created this project description';
export const TARGETED_CMIP5_DATASET_TITLE = 'pr_Amon_CanESM2_historical_r1i1p1_185001-200512.nc';

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
export const WORKFLOW_INPUT_TYPENAME_ALT = "usa:states";
export const WORKFLOW_INPUT_FEATUREIDS_ALT = "states.10";
export const WORKFLOW_INPUT_MOSAIC = "True";
export const BASIC_WORKFLOW_NAME = "BASIC_WORKFLOW_NAME";
export const WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME = "WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME";
export const SUBSET_WORKFLOW_NAME = "SUBSET_WORKFLOW_NAME";

// Layer names
export const LAYER_SELECTED_REGIONS_NAME = 'LAYER_SELECTED_REGIONS';
export const LAYER_REGIONS_NAME = 'LAYER_REGIONS';
export const LAYER_DATASET_NAME = 'LAYER_DATASET';
export const SHAPEFILE_NAME_NESTATES = 'NE_State_and_Province_Boundaries';

// Workflows
export const BASIC_WORKFLOW_JSON = {
	"name": BASIC_WORKFLOW_NAME,
	"tasks": [
		{
			"name": "Downloading",
			"identifier": "thredds_download",
			"inputs": {
				"url": WORKFLOW_INPUT_DOWNLOAD_URL
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
						"typename": WORKFLOW_INPUT_TYPENAME,
						"featureids": WORKFLOW_INPUT_FEATUREIDS,
						"mosaic": WORKFLOW_INPUT_MOSAIC
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

export const SUBSET_WORKFLOW_JSON = {
	"name": SUBSET_WORKFLOW_NAME,
	"tasks": [
		{
			"name": "Subsetting",
			"identifier": "subset_WFS",
			"inputs": {
				"resource":WORKFLOW_INPUT_RESOURCE,
				"typename": WORKFLOW_INPUT_TYPENAME,
				"featureids": WORKFLOW_INPUT_FEATUREIDS,
				"mosaic": WORKFLOW_INPUT_MOSAIC
			},
			"provider": "flyingpigeon"
		}
	]
}

export const SUBSET_PARALLEL_JSON = {
	"name": "parsingcatalog_parallel_subset",
	"tasks": [
		{
			"name": "ParsingCatalog",
			"provider": "malleefowl",
			"url": "https://colibri.crim.ca/twitcher/ows/proxy/malleefowl/wps",
			"identifier": "thredds_opendap_urls",
			"inputs": {
				"url": "https://colibri.crim.ca/twitcher/ows/proxy/thredds/catalog/birdhouse/CMIP5/CCCMA/CanESM2/historical/day/atmos/r1i1p1/pr/catalog.xml"
			},
			"progress_range": [
				0,
				10
			]
		}
	],
	"parallel_groups": [
		{
			"name": "FlyGroup",
			"map": {
				"task": "ParsingCatalog",
				"output": "output",
				"as_reference": false
			},
			"reduce": {
				"task": "Subsetting",
				"output": "output",
				"as_reference": true
			},
			"max_processes": 4,
			"tasks": [
				{
					"name": "Subsetting",
					"provider": "flyingpigeon",
					"url": "https://colibri.crim.ca/twitcher/ows/proxy/flyingpigeon/wps",
					"identifier": "subset_WFS",
					"inputs": {
						"typename": "opengeo:NE_State_and_Province_Boundaries",
						"featureids": "NE_State_and_Province_Boundaries.564",
						"mosaic": "False"
					},
					"linked_inputs": {
						"resource": {
							"task": "FlyGroup"
						}
					},
					"progress_range": [
						10,
						100
					]
				}
			]
		}
	]
};

export const WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_JSON = {
	"name": WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_NAME,
	"tasks": [
		{
			"name": "region_subset",
			"identifier": "subset_countries",
			"inputs": {
				"region": ""
			},
			"progress_range": [
				0,
				100
			],
			"provider": "flyingpigeon"
		}
	]
};

export const INVALID_WORKFLOW_JSON = {
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

export const MISSING_PROVIDER_WORKFLOW_JSON = {
	"name": "MISSING_PROVIDER_WORKFLOW",
	"tasks": [
		{
			"name": "Test",
			"identifier": "test",
			"inputs": {
				"test": "cypress"
			},
			"provider": "xyz"
		}
	]
};

// Escape openning brackets since cypress use them as 'sequences' keywords
export const BASIC_WORKFLOW = JSON.stringify(BASIC_WORKFLOW_JSON).replace(/{/g, '{{}');
export const SUBSET_WORKFLOW = JSON.stringify(SUBSET_WORKFLOW_JSON).replace(/{/g, '{{}');
export const SINGLE_ALLOWED_VALUES_TASK_WORKFLOW = JSON.stringify(WORKFLOW_SINGLE_ALLOWED_VALUES_TASK_JSON).replace(/{/g, '{{}');
export const INVALID_WORKFLOW = JSON.stringify(INVALID_WORKFLOW_JSON).replace(/{/g, '{{}');
export const MISSING_PROVIDER_WORKFLOW = JSON.stringify(MISSING_PROVIDER_WORKFLOW_JSON).replace(/{/g, '{{}');