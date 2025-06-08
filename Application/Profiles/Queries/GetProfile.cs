using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles.Queries
{
    public class GetProfile
    {
        public class Query : IRequest<Result<UserProfile>>
        {
            public required string UserId { get; set; }
        }

        // IMapper needed to map the User entity to UserProfile DTO
        public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Query, Result<UserProfile>>
        {
            public async Task<Result<UserProfile>> Handle(Query request, CancellationToken cancellationToken)
            {
                // Using ProjectTo to map the User entity to UserProfile DTO
                // Make sure when using ProjectTo, the UserProfile DTO is configured in the AutoMapper profile
                var profile = await context.Users.ProjectTo<UserProfile>(mapper.ConfigurationProvider).SingleOrDefaultAsync(x => x.Id == request.UserId, cancellationToken);

                return profile == null
                    ? Result<UserProfile>.Failure("Profile not found", 404)
                    : Result<UserProfile>.Success(profile);
            }
        }
    }
}