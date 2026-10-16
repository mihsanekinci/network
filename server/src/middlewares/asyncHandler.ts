import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncExpressFonksiyonu<
  Req extends Request = Request,
  Res extends Response = Response
> = (req: Req, res: Res, next: NextFunction) => Promise<unknown>;

/**
 * Asenkron controller fonksiyonlarını sarmalayarak try/catch gereksinimini
 * ortadan kaldıran ve oluşan hataları otomatik olarak Express next(hata)
 * zincirine ileten sarmalayıcı (wrapper).
 */
export const asyncHandler = <
  Req extends Request = Request,
  Res extends Response = Response
>(
  fn: AsyncExpressFonksiyonu<Req, Res>
): RequestHandler => {
  return (req, res, next) => {
    return Promise.resolve(fn(req as Req, res as Res, next)).catch(next);
  };
};

export default asyncHandler;
