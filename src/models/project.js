import path from "path";
export const Project = () => {
    let state = {};


    const getState = () => {
        return state;
    }

    const initializeGit = () => {
        console.log('Initializing Git');
    }

    const setProjectName = (projectName) => {
        state['projectName'] = projectName;
    }

    const getProjectName = () => {
        return state['projectName'];
    }

    const setProjectPath = (projectPath) => {
        state['projectPath'] = projectPath;
    }

    const getProjectPath = () => {
        return state['projectPath'];
    }

    const setIsGitInit = (isGitInit) => {
        state['isGitInit'] = isGitInit;
    }

    const getIsGitInit = () => {
        return state['isGitInit'];
    }

    const setProjectType = (projectType) => {
        state['projectType'] = projectType;
    }

    const getProjectType = () => {
        return state['projectType'];
    }

    const setTemplatePath = () => {
        // state["templatePath"] = path.join(
        //     new URL(import.meta.url).pathname,
        //     "../../../templates/javascript",
        //     state['projectType']
        // );
        
        //If it has problems with windows
        state["templatePath"] = path.join(
            process.platform === "win32"
                ? new URL(import.meta.url).pathname.substring(1)
                : new URL(import.meta.url).pathname,
            "../../../templates/javascript",
            state['projectType']
        );
    }

    const getTemplatePath = () => {
        return state["templatePath"];
    }

    const setDatabase = (database) => {
        state['database'] = database;
    }

    const getDatabase = () => {
        return state['database'];
    }


    return {
        getState,
        initializeGit,
        setProjectName,
        getProjectName,
        setProjectPath,
        getProjectPath,
        setIsGitInit,
        getIsGitInit,
        getProjectType,
        setProjectType,
        setTemplatePath,
        getTemplatePath,
        setDatabase,
        getDatabase
    }
}

