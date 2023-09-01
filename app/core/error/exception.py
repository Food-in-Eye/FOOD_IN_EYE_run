
class APIException(Exception):
    status_dict = {
        200.0 : "OK",
        204.0 :	"No content",

        400.0 : "Bad request",

        401.0 : "Access denied",
        401.1 : "Logon failed",
        401.6 : "Token ",

        403.0 : "Forbidden",
        403.1 : "Execute access forbidden.",
        403.2 : "Read access forbidden.",
        403.3 : "Write access forbidden.",
        403.6 : "Signature renewal forbidden.",

        404.0 : "Not found",

        405.0 : "Method not allowed",

        409.0 : "Conflict",
        409.1 : "Duplicate ID.",
        409.2 : "Duplicate NAME."
    }

    def __init__(self):
        self.DEFAULT_CODE = 500,
        self.DEFAULT_DETAIL = "Internal server error" 

    def get_status(self, ex:float) -> (int, str):
        detail = self.status_dict.get(ex)

        if detail != '':
            return int(ex), detail
        return self.DEFAULT_CODE, self.DEFAULT_DETAIL