from django.http import JsonResponse

class HttpCode(object):
	ok = 200
	paramserror = 400
	unauth = 401
	methoderror = 405
	servererror = 500

def result(code=HttpCode.ok, message='', data=None, **kwargs):
	dirct = {"code":code, "message":message, "data":data}
	if kwargs and isinstance(kwargs,dict) and kwargs.keys():
		dirct.update(kwargs)
	return JsonResponse(dirct)

def ok(message='', data=None):
	dirct = {"code": HttpCode.ok, "message": message, "data": data}
	return JsonResponse(dirct)

def paramserror(message='', data=None):
	dirct = {"code": HttpCode.paramserror, "message": message, "data": data}
	return JsonResponse(dirct)

def unauth(message='', data=None):
	dirct = {"code": HttpCode.unauth, "message": message, "data": data}
	return JsonResponse(dirct)

def methoderror(message='', data=None):
	dirct = {"code": HttpCode.methoderror, "message": message, "data": data}
	return JsonResponse(dirct)

def servererror(message='', data=None):
	dirct = {"code": HttpCode.servererror, "message": message, "data": data}
	return JsonResponse(dirct)