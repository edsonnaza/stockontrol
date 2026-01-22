<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Force HTTPS in production
        if (env('APP_ENV') === 'production' && !$request->secure()) {
            // If we're behind a proxy that handles HTTPS, check the forwarded proto header
            if ($request->header('X-Forwarded-Proto') === 'https') {
                // Assume it's secure, proceed
                return $next($request);
            }
            
            return redirect()->secure($request->getRequestUri(), 301);
        }

        return $next($request);
    }
}
