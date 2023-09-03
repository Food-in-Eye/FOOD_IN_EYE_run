
class CustomException(Exception):
    def __init__(self, status_code:float):
        self.status_code = status_code


class APIException(Exception):
    STATUS_DICT = {
        200.0 : "OK",
        204.0 :	"No content",

        400.0 : "Bad request",

        401.0 : "Access denied",
        401.1 : "Logon failed.",
        # .6 : Token / User ERROR
        401.61 : "Token has not exist.",
        401.62 : "Token has expired.",

        403.0 : "Forbidden",
        403.1 : "Execute access forbidden.",
        403.2 : "Read access forbidden.",
        403.3 : "Write access forbidden.",
        403.6 : "Token renewal forbidden.",

        404.0 : "Not found",

        405.0 : "Method not allowed",

        409.0 : "Conflict",
        409.1 : "Duplicate ID.",
        409.2 : "Duplicate NAME.",

        422.0 : "Unprocessable Entity",
        422.6 : "Token(ownership) verification failed."
    }

    def __init__(self):
        self.DEFAULT_CODE = 500,
        self.DEFAULT_DETAIL = "Internal server error" 

    def get_status(self, ex:CustomException) -> (int, str):
        if ex.status_code in self.STATUS_DICT:
            detail = self.STATUS_DICT.get(ex.status_code)

            if detail != '':
                return int(ex.status_code), detail
        return self.DEFAULT_CODE, self.DEFAULT_DETAIL
    
    def get_status_assert(self, ex:AssertionError) -> (int, str):
        if ex.args[0] in self.STATUS_DICT:
            detail = self.STATUS_DICT.get(ex.args[0])

            if detail != '':
                return int(ex.args[0]), detail
        return self.DEFAULT_CODE, self.DEFAULT_DETAIL
    
