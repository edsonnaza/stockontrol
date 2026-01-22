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
        // In production, ensure the request is recognized as HTTPS
        // when behind a proxy (like Railway)
        if (env('APP_ENV') === 'production') {
            // Check if we have HTTPS indicators from proxy
            if ($request->header('X-Forwarded-Proto') === 'https') {
                // Force the request to be recognized as HTTPS
                $_SERVER['HTTPS'] = 'on';
                $_SERVER['SERVER_PORT'] = 443;
                $_SERVER['REQUEST_SCHEME'] = 'https';
                
                // Notify Laravel that this is a secure connection
                if (!$request->isSecure()) {
                    // This ensures url() helper generates HTTPS URLs
                    $request->server->set('HTTPS', 'on');
                }
            }
        }

        return $next($request);
    }
}

