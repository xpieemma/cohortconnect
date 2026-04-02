export function isProjectOwner(projectOwner, userId) {
    // If populated, item is an object, if not, item is ObjectId
    return projectOwner._id ? projectOwner._id === userId : projectOwner === userId
}

export function isProjectCollaborator(collaborators, userId) {

    // Check if array contains a specific ID, regardless of population
    const hasItem = collaborators.some(item => {
        // If populated, item is an object, if not, item is ObjectId
        return item._id ? item._id.toString() === userId : item.toString() === userId
    });

    return hasItem
}