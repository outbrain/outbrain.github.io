"use strict";

var obApp = angular.module('outbrainGithubApp', []);

obApp.controller('ProjectsDisplayController', ['$scope', '$http', function ($scope, $http) {

    var $jq = jQuery.noConflict();

    var $outbrainOrg = "outbrain";
    var $heroProjects = ["ob1k", "orchestrator", "aletheia", "leonardo", "gruffalo", "cassibility"];

    // Hiding all projects divs until we finish loading data from GitHub
    $scope.loading = true;

    // For links
    $scope.outbrainOrg = $outbrainOrg;
    $scope.heroProjects = $heroProjects;
    $scope.projectsData = {};

    // Transform from List<Projects> to Map<ProjectName, ProjectDetails>
    var $invertResponse = function (responseData) {
        var invertedResponse = {};

        for (var i = 0; i < responseData.length; i++) {
            var project = responseData[i];

            // We do not want projects without description
            if (project.description == null || project.description.trim() == "") {
                console.log("Project " + project.name + " does not have description! will not be shown");
                continue;
            }

            invertedResponse[project.name.toLowerCase()] = {
                originalName: project.name,
                forks: project.forks_count,
                stars: project.stargazers_count,
                // in case GitHub doesn't know the project lang
                language: project.language ? project.language : "General",
                description: project.description
            }
        }

        return invertedResponse;
    };

    // Categorize projects by groups
    var $splitProjects = function (projects) {
        var projectsByTypes = {
            hero: {},
            additional: {}
        };

        for (var projectName in projects) {
            if (projects.hasOwnProperty(projectName)) {
                if ($filterSelfPredicate(projectName)) {
                    continue;
                }

                var project = projects[projectName];
                if ($heroProjects.indexOf(projectName) >= 0) {
                    projectsByTypes.hero[projectName] = project;
                } else {
                    projectsByTypes.additional[projectName] = project;
                }
            }
        }

        return projectsByTypes;
    };

    // Predicate for filtering the GitHub pages project
    var $filterSelfPredicate = function(projectName) {
        return projectName === "outbrain.github.io";
    };

    // Response handler
    var $handleResponse = function (response) {
        var allProjects = $invertResponse(response.data);
        var projectsByTypes = $splitProjects(allProjects);

        $scope.projectsData.heroProjects = projectsByTypes.hero;
        $scope.projectsData.additionalProjects = projectsByTypes.additional;
        $scope.loading = false;
    };

    // Error handler
    var $handleError = function (errorResponse) {
        console.log('Failed sending request to GitHub', errorResponse);
        alert('Failed loading projects! Make sure your internet connection is fine and reload.');
        $jq('.loading-projects').text('Failed loading projects');
    };

    // Fetching the projects
    $http({
        method: 'GET',
        url: 'https://api.github.com/orgs/' + $outbrainOrg + '/repos?type=sources'
    }).then(function successCallback(response) {
        $handleResponse(response);
    }, function errorCallback(response) {
        $handleError(response);
    });
}]);
