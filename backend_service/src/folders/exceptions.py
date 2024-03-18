from src.common.exceptions import DetailedHTTPException


class FolderWithSuchTitleAlreadyExists(DetailedHTTPException):
    STATUS_CODE = 409
    DETAIL = "Folder with such title already exists"


class FolderAlreadyContainsNews(DetailedHTTPException):
    STATUS_CODE = 409
    DETAIL = "Folder already contains news"
