const { createResource, updateResourceUrl } = require('../../dao/scorm/scormDao');
const { extractScorm, getLaunchFile } = require('../../utils/scorm')
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const messages = require('../../utils/messages');

//CREATE SCORM
async function createResourceController(req, res) {
    try {
        const file = req.files?.scorm_package;
        const { module_id, uploaded_by, description } = req.body;

        if (!file || !['application/zip', 'application/x-zip-compressed'].includes(file.mimetype)) {
            return errorResponse(req, res, 400, messages.INVALID_FILE);
        }
        const resource = await createResource({
            module_id,
            uploaded_by,
            description,
            file_size: file.size,
        })

        if (!resource || !resource.id) {
            return errorResponse(req, res, 500, messages.FAILED_TO_CREATE)
        }

        const extractPath = await extractScorm(file, resource.id);

        const launchFile = await getLaunchFile(extractPath);

        const url = `/uploads/scorm/${resource.id}/${launchFile}`;

        const updated = await updateResourceUrl({ id: resource.id, url });

        return successResponse(req, res, updated, 201,messages.SCORM_UPDATED_SUCCESSFULLY)
    }
    catch (error) {
        return errorResponse(req, res, 500, `Error uploading SCORM package: ${error.message}`);
    }

}
module.exports = {
    createResourceController,
}

