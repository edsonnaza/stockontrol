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
            if ($request->header('X-Forwarded-Proto') === 'https' ||
                $request->header('X-Forwarded-Ssl') === 'on' ||
                $request->header('CF-Visitor') ||
                $request->isSecure()) {
                
                // Force the request to be recognized as HTTPS
                if (!$request->isSecure() && $request->header('X-Forwarded-Proto') === 'https') {
                    // Set the scheme to https for Laravel's URL generation
                    $_SERVER['HTTPS'] = 'on';
                    $_SERVER['SERVER_PORT'] = 443;
                }
            }
        }

        return $next($request);
    }
}

